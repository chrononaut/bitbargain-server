const db = require('./config');
const es = require('../search/elasticSearch');


module.exports = {
    // all methods return a promise
    // getters resolve with -> [{...}, {...}, ...]
    // create methods can take an array of objects -> [{data}, {...}, ...]

    //All queries relating to items are stored here
  items: {
    //Get all items from the db: should never be called because the array will be massive
    getAll() {
      return db.select().from('items')
      .catch(err => console.error(`Error fetching data from "items" table ${err}`));
    },
    //Deprecated
    getAllCategories() {
      return db('items').distinct('category').select('category')
      .catch(err => console.error(`Error getting categories ${err}`));
    },
    //Gets an item by it's name, is never used
    getByTitle(title) {
      return db('items').where('title', title)
      .catch(err => console.error(`Error getting item by title ${err}`));
    },
    // Experimental
    getByCategory(category) {
      return db('items').where('category', category)
      .catch(err => console.error(`Error getting item by category ${err}`));
    },
    //Gets an item by it's id
    getById(id) {
      return db('items').where('id', id)
      .catch(err => console.error(`Error getting item by id ${err}`));
    },
    //Returns multiple items which have their id in an array of ids
    getByIds(ids) {
      return db('items').whereIn('id', ids)
      .catch(err => console.error(`Error getting item by id ${err}`));
    },
      // expects data to be formatted as {title: '', category: '', etc...}
      // can take an array of data objects -> [{...}, {...}, ...]
      // resolves promise with id of first inserted record -> [id]
    create(data) {
      console.log('Inserting, ', data, typeof data);
      return db('items').insert(data, 'id')
        .then((res) => {
          data.id = res[0];
          es.insertItem(data);
          return res;
        })
        .catch(err => console.error(`Error inserting into "items" table ${err}`));
    },
    // takes an item id and updates/toggles the sold field
    sold(id) {
      return db('items').where('id', id)
      .update('sold', 'true');
    }
  },
  //All queries related to users
  users: {
    //Returns a list of all users, usually isn't called because it will be a pretty large array
    getAll() {
      return db.select().from('users')
      .catch(err => console.error(`Error getting all users ${err}`));
    },
    //Gets a user by their name, never called
    getByName(username) {
      return db('users').where('username', username)
      .catch(err => console.error(`Error getting user by username ${err}`));
    },
    //Gets a user by email, used when serializing and deserializing from coinbase
    getByEmail(email) {
      return db('users').where('email', email)
      .catch(err => console.error(`Error getting user by email ${err}`));
    },
    //Gets a user by id, used for relationial lookups
    getById(id) {
      return db('users').where('id', id)
      .catch(err => console.error(`Error getting user by id ${err}`));
    },
    // takes an object -> {username: '', email: ''} and creates a new user
    // can accept an array of objects
    // returns promise that resolves with id of first newly made user
    create(user) {
      return db('users').insert(user, 'id');
    },
    //Changes a field of the user entry by email, used to change coinbase id of a user
    updateUser(email, props) {
      return db('users').where('email', email).update(props);
    }
  },
  //Transactions represent any time someone buys an item and all queries for tx are here
  transactions: {
    //Returns all transactions, generally isn't called
    getAll() {
      return db.select().from('transactions')
      .catch(err => console.error(`Error getting all transactions ${err}`));
    },
    //Get a transaction by the item being sold's id
    getByItemId(id) {
      return db('transactions').where('item_id', id);
    },
    //Gets all disputes from the database
    getAllDisputes() {
      return db('transactions').where('order_status', 'disputed');
    },
    // data = {item_id: item id(num), buyer_id: user id(num), seller_id: user id(num)}
    // can take an array of data objects -> [{...}, {...}, ...]
    // resolves promise by returning the id of the first newly created record
    create(data) {
      return db('transactions').insert(data, 'id')
      .catch(err => console.error(`Error inserting into transactions table ${err}`));
    },
    //Changes the status of a transaction, used for disputes and for who won and lost the dispute
    updateTransaction(id, props) {
      return db('transactions').where('id', id).update(props);
    }
  },
  images: {
    getById(itemId, picId) {
      if (picId !== undefined) {
        return db('images').where('item_id', itemId).andWhere('pic_id', picId);
      }
      return db('images').where('item_id', itemId);
    },
    createImage(itemId, s3Url) {
      // First we check to see if there are images for this account.
      return db('images').where('item_id', itemId).then(images => images.length)
        .then((len) => {
          const length = (len === undefined ? 1 : len + 1);
          return db('images').insert({
            item_id: itemId,
            pic_id: length,
            url: s3Url
          });
        });
    },
    createImages(itemId, s3Urls) {
      // First we check to see if there are images for this account.
      return db('images').where('item_id', itemId).then(images => images.length)
        .then((len) => {
          let length = (len === undefined ? 1 : len + 1);
          s3Urls.forEach((s3Url) => {
            db('images').insert({
              item_id: itemId,
              pic_id: length,
              url: s3Url
            });
            length += 1;
          });
        });
    }
  },
  track_user: {
    addRoute(uid, iid) {
      return db('track_user').insert({ uid: uid, iid: iid })
        .catch(e => console.error(`There was an error inserting into the tracker ${e}`));
    },
    getRecent(uid) {
      //Gets the recent items a user was looking at by using a raw sql query.
      if (!uid || (typeof uid !== 'string' && typeof uid !== 'number')) {
        return Promise.reject(`Could not get recent items of user id '${uid}'`);
      }
      return db.raw(`
select 
      id
    , title
    , description
    , category
    , price
    , location
from
    (
    select
          *
        , row_number() over (partition by uid, iid order by selected desc nulls last) rn
    from items i
    inner join track_user u
    on i.id = u.iid
    where u.uid = ?
      and i.sold = false
    ) a
where rn     = 1
order by selected desc
limit 4;`, [uid]).then(r => r.rows);
    },
    getSimilar(uid) {
      if (!uid || (typeof uid !== 'string' && typeof uid !== 'number')) {
        return Promise.reject(`Could not get recent items of user id '${uid}'`);
      }
      return db.raw(`
with tab1 as
  (
  select
      a.uid                 as curr_user
    , b.uid                 as oth_user
    , count(distinct a.iid) as cnt
  from track_user a
  inner join track_user b
  on
    (
        a.iid =  b.iid
    and a.uid <> b.uid
    )
    where a.uid = ?
    group by a.uid
           , b.uid
    order by cnt desc
  )
  select i.*
  from items i
  inner join
    (
  select
      a.uid
    , a.iid
    , count(distinct a.uid || ',' || a.iid) as cnt
    , max(a.selected)                       as mx
  from track_user a
  inner join tab1 b
  on
    (
    a.uid = b.oth_user
    )
  inner join items i
  on i.id = a.iid
  where i.sold = false
  group by a.uid, a.iid
  order by cnt desc, mx desc
  limit 5
  ) a
on a.iid = i.id
;
`, [uid]).then(r => r.rows);
    }
  }
};
