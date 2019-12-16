const User = require("../models/user.model");
const UserGroup = require("../models/usergroup.model");
const UserHistory = require("../models/userhistory.model");
const UserGroupHistory = require("../models/usergrouphistory.model");
const passport = require("passport");

const _getGroupUsers = function(userDetail) {
  return new Promise(function(resolve, reject) {
    UserGroup.find({}, function(err, usergroup) {
      if (err) return reject(err);

      let usergroups = [];
      usergroup.forEach((u, i) => {
        let _u = JSON.parse(u.users);
        if (_u.indexOf(userDetail.email) >= 0) {
          let t = {};
          t.group = "Group " + u._id;
          t.id = u._id;
          t.users = u.users;
          usergroups.push(t);
        }
      });
      return resolve(usergroups);
    });
  });
};

exports.userhistory = function(req, res) {
  const activeUser = req.body.user;
  const chatUserID = req.body.chatUserID;
  UserHistory.find(
    {
      $or: [
        { $and: [{ fromID: activeUser.email }, { toID: chatUserID }] },
        { $and: [{ fromID: chatUserID }, { toID: activeUser.email }] }
      ]
    },
    function(err, user) {
      console.log(user);
      if (err) {
        return res.json({
          error: 1,
          message: err
        });
      }
      return res.json({
        success: 1,
        users: user
      });
    }
  );

  //res.send("Get User");
};

exports.usergrouphistory = function(req, res) {
  UserGroupHistory.find({ groupID: req.body.chatGroupIDs }, function(
    err,
    user
  ) {
    if (err) {
      return res.json({
        error: 1,
        message: err
      });
    }
    return res.json({
      success: 1,
      users: user
    });
  });
};

exports.group_history_delete = function(req, res) {
  UserGroupHistory.findByIdAndRemove(req.body.id, function(err) {
    if (err) {
      return res.json({
        error: 1,
        message: err
      });
    }
    return res.json({
      success: 1,
      message: "Group User history deleted successfully"
    });
  });
};
exports.history_delete = function(req, res) {
  UserHistory.findByIdAndRemove(req.body.id, function(err) {
    if (err) {
      return res.json({
        error: 1,
        message: err
      });
    }
    return res.json({
      success: 1,
      message: "User history deleted successfully"
    });
  });
};
exports.user = function(req, res) {
  User.find({}, function(err, user) {
    if (err) {
      return res.json({
        error: 1,
        message: err
      });
    }
    return res.json({
      success: 1,
      users: user
    });
  });
};
exports.groupuser = async function(req, res) {
  let userDetail = req.body.user;
  const _userGroups = await _getGroupUsers(userDetail);
  console.log("use=", _userGroups);

  return res.json({
    success: 1,
    usergroups: _userGroups
  });
};

exports.groups = function(req, res) {
  UserGroup.find({ _id: req.body.chatGroupIDs }, function(err, usergroup) {
    if (err) return reject(err);
    return res.json({
      success: 1,
      message: "Users added to the group",
      users: usergroup
    });
  });
};

exports.addgroupuser = function(req, res) {
  let groupUser = new UserGroup({
    users: JSON.stringify(req.body.users)
  });
  groupUser.save(function(err, result) {
    if (err) {
      return res.status(500).json({
        error: 1,
        message: err
      });
    }
    res.json({
      success: 1,
      message: "Users added to the group",
      id: result._id
    });
  });
};


exports.addgrouphistory = function(req, res) {
  let groupUser = new UserGroupHistory({
    groupID: req.body.groupID,
    fromID: req.body.fromID,
    message: req.body.message
  });
  groupUser.save(function(err, result) {
    if (err) {
      return res.status(500).json({
        error: 1,
        message: err
      });
    }
    res.json({
      success: 1,
    });
  });
};

exports.addhistory = function(req, res) {
  let groupUser = new UserHistory({
    toID: req.body.toID,
    fromID: req.body.fromID,
    message: req.body.message
  });
  groupUser.save(function(err, result) {
    if (err) {
      return res.status(500).json({
        error: 1,
        message: err
      });
    }
    res.json({
      success: 1,
    });
  });
};

exports.register = async function(req, res, next) {
  const user = req.body;
  // validate information
  req.checkBody("email", "Email is required.").notEmpty();
  req.checkBody("password", "Password is required.").notEmpty();

  // if there are errors, redirect and save errors to flash
  const errors = req.validationErrors();
  if (errors) {
    return res.json({
      error: 1,
      message: errors.map(err => err.msg)
    });
    // return res.render('auth/login.ejs', {
    //     errors: errors.map(err => err.msg)
    // });
  }
  let newUser = new User({
    email: user.email,
    name: user.name
  });
  const userData = await User.find({ email: user.email }, function(err, user) {
    return user;
  });
  if (userData && userData.length > 0) {
    return res.json({
      error: 1,
      message: "Email already exiats!"
    });
  }
  newUser.setPassword(user.password);
  newUser.save(function(err) {
    if (err) {
      return res.status(500).send({
        error: 1,
        message: err
      });
    }
    return res.json({
      success: 1,
      message: "Registered Successfully",
      user: newUser
    });
    // req.flash('success','Successfully Registered.');
    // res.redirect('/login');
  });
};

exports.login = function(req, res, next) {
  const user = req.body;
  // validate information
  req.checkBody("email", "Email is required.").notEmpty();
  req.checkBody("password", "Password is required.").notEmpty();

  // if there are errors, redirect and save errors to flash
  const errors = req.validationErrors();
  if (errors) {
    return res.json({
      error: 1,
      message: errors.map(err => err.msg)
    });
  }

  passport.authenticate(
    "local-login",
    { session: false },
    (err, passportUser, info) => {
      req.login(passportUser, err => {
        if (req.user) {
          //req.session = req.user

          console.log("Inside req.login() callback ");
          console.log(
            `req.session.passport: ${JSON.stringify(req.session.passport)}`
          );
          if (err) {
            return next(err);
          }
          return res.json({
            success: 1,
            user: user
          });
        } else {
          return res.json({
            error: 1,
            message: "User not found!"
          });
        }
      });
    }
  )(req, res, next);
};
