const knex = require('knex')(
  require('../knexfile.js')[process.env.NODE_ENV || 'development']
);

// login or registration ////////////////////////////////////////
const postNewUser = async userInfo => {
  // console.log(userInfo);
  let results = await knex('user_table').insert(userInfo, ['*']);
  delete results.password;
  return results;
};

const userCheck = async email => {
  console.log(email);
  let results = await knex('user_table').select('*').where('email', email);
  if (results[0] === undefined) {
    return null;
  } else {
    console.log('user found');
    return results[0];
  }
};

// helper functions //////////////////////////////////////
const addWeapon = async users => {
  let modifiedUsers = users;
  for (let user of modifiedUsers) {
    let newWeapons = await knex('weapon_user')
      .select('weapon', 'weapon.*')
      .where('user_id', user.id)
      .fullOuterJoin('weapon', 'weapon_id', '=', 'weapon.id');
    user.weapons = newWeapons;
    //if this throws us for a loop on the front end, write
    //function to empty weapons array null values
  }
  return modifiedUsers;
};
const addCerts = async users => {
  let modifiedUsers = users;
  for (let user of modifiedUsers) {
    let newCerts = await knex('certification')
      .select('*')
      .where('id', user.cert_id);
    user.certs = newCerts;
  }
  return modifiedUsers;
};

const postWeapon = async posts => {
  let modifiedPosts = posts;
  for (let post of modifiedPosts) {
    let newWeapons = await knex('weapon_position')
      .select('*')
      .where('position_id', post.id)
      .fullOuterJoin('weapon', 'weapon_id', '=', 'weapon.id');
    post.weapon_req = newWeapons;
  }
  return modifiedPosts;
};

const postCert = async posts => {
  let modifiedPosts = posts;
  for (let post of modifiedPosts) {
    let newCert = await knex('certification')
      .select('*')
      .where('id', post.cert_id);
    post.cert_req = newCert;
  }
  return modifiedPosts;
};

// user /////////////////////////////////////////////////////////////
const getAllUsers = async () => {
  let users = await knex('user_table').select('*').orderBy('last_name', 'asc');
  let wepUsers = await addWeapon(users);
  let certUsers = await addCerts(wepUsers);
  return certUsers;
};

const searchUsers = async searchInput => {
  searchInput = searchInput.toLowerCase();
  console.log('search input: ', searchInput);
  let users = await knex('user_table')
    .select('*')
    .whereILike('first_name', `%${searchInput}%`)
    .orWhereILike('last_name', `%${searchInput}%`);
  let wepUsers = await addWeapon(users);
  let certUsers = await addCerts(wepUsers);
  return certUsers;
};

const individualUser = async id => {
  let users = await knex('user_table').where({ id: id });
  let wepUsers = await addWeapon(users);
  let certUsers = await addCerts(wepUsers);
  return certUsers;
};

const deleteWeaponUser = async userId => {
  let results = await knex('weapon_user')
    .where({ user_id: userId })
    .delete(['*']);
  return results;
};

const postWeaponUser = async (userId, wepArray) => {
  console.log('userId: ', userId, 'wep array, ', wepArray);
  if (wepArray.length > 0) {
    let insertInfo = wepArray.map(wep => {
      let postObject = {
        user_id: parseInt(userId),
        weapon_id: wep,
      };
      return postObject;
    });
    let result = await knex('weapon_user').insert(insertInfo, ['*']);
    console.log('results of insert to weapon_user', result);
    return result;
  }
};

const postUsers = async req => {
  let newUser;
  if (req.body.first_name) {
    newUser = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      admin: req.body.admin,
      rank: req.body.rank,
      cert_id: req.body.cert_id,
      email: req.body.email,
      weapon_arming: req.body.weapon_arming,
      notes: req.body.notes,
    };
  } else {
    newUser = req;
  }

  let result = await knex('user_table').insert(newUser, ['*']);
  console.log('This is result, newusers: ', result, newUser);
  console.log('result: ', result);
  if (req.body && req.body.weaponIdArray) {
    await postWeaponUser(result[0].id, req.body.weaponIdArray);
    console.log('This is result: ', result);
  }
  return result;
};

const updateUser = async req => {
  console.log('This is req.body for update user: ', req.body);
  const newUser = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    admin: req.body.admin,
    rank: req.body.rank,
    cert_id: req.body.cert_id,
    email: req.body.email,
    weapon_arming: req.body.weapon_arming,
    notes: req.body.notes,
  };
  console.log('new user ', newUser);
  await deleteWeaponUser(req.params.id);
  await postWeaponUser(req.params.id, req.body.weaponIdArray);
  // knex.raw('TRUNCATE users_table CASCADE');
  return await knex('user_table').where({ id: req.params.id }).update(newUser);
};

// schedules //////////////////////////////////////////////
const getAllSchedule = async () => {
  let schedules = await knex('post_schedule').select('*');
  let schedUsers = await schedAddUsers(schedules);
  return schedUsers;
};

const schedAddUsers = async schedules => {
  let newSchedules = schedules;
  for (let schedule of newSchedules) {
    // call user by id and add to sched
    let userInfo = await individualUser(schedule.user_id);
    schedule.user_info = userInfo;
  }
  return newSchedules;
};

const getScheduleByDate = async props => {
  // console.log('before knex date', props)
  let schedules = await knex('post_schedule')
    .select('*')
    .whereBetween('date', [props.date, props.dateEnd]);
  let schedUsers = await schedAddUsers(schedules);
  return schedUsers;
};

const patchSchedule = async schedule => {
  console.log(schedule);
  let results = await knex('post_schedule').insert(schedule, ['*']);
  return results;
};

const deleteScheduleById = async id => {
  console.log('deleteing schedule', id);
  let results = await knex('post_schedule').where('id', id).del(['*']);
  return results;
};

const deleteUser = async id => {
  await deleteWeaponUserByUser(id);
  await deletePostSchedule(id);
  return await knex('user_table').where({ id: id }).delete();
};

// position /////////////////////////////////////////////////////////////
const getAllposition = async () => {
  let positions = await knex('position').select('*').orderBy('id', 'asc');
  let positionsWeapon = await postWeapon(positions);
  let positionsCerts = await postCert(positionsWeapon);
  return positionsCerts;
};

const allWeapons = () => {
  return knex('weapon').select('*');
};

const allFlights = () => {
  return knex('flight').select('*');
};

const deleteWeaponPosition = async positionId => {
  let results = await knex('weapon_position')
    .where({ position_id: positionId })
    .delete(['*']);
  return results;
};

const postWeaponPosition = async (positionId, wepArray) => {
  let insertInfo = wepArray.map(wep => {
    let postObject = {
      position_id: parseInt(positionId),
      weapon_id: wep,
    };
    return postObject;
  });
  let result = await knex('weapon_position').insert(insertInfo, ['*']);
  console.log('results of insert to weapon_position', result);
  return result;
};

const patchPosition = async req => {
  console.log('this is req.body for patch position: ', req.body);
  let patchObject = {
    name: req.body.name,
    man_req: req.body.man_req,
    cert_id: req.body.cert_id,
  };
  await deleteWeaponPosition(req.params.id);
  console.log('between delete and post');
  await postWeaponPosition(req.params.id, req.body.weapon_req);
  console.log('between post and patch');
  let result = await knex('position')
    .where({ id: req.params.id })
    .update(patchObject, ['*']);
  return result;
};

const updateWeaponUser = req => {
  knex.raw('TRUNCATE weapon_user CASCADE');
  return knex('weapon_user').where({ id: req.params.id }).update(req.body);
};

const deleteWeaponUserByUser = async userId => {
  return knex('weapon_user').where({ user_id: userId }).delete();
};

const deletePostSchedule = async userId => {
  return knex('post_schedule').where({ user_id: userId }).delete();
};

module.exports = {
  getAllUsers,
  postUsers,
  individualUser,
  postWeaponUser,
  deleteUser,
  updateUser,
  updateWeaponUser,
  allWeapons,
  deleteWeaponUser,
  getAllSchedule,
  getScheduleByDate,
  searchUsers,
  getAllposition,
  patchSchedule,
  deleteScheduleById,
  patchPosition,
  userCheck,
  allFlights,
};
