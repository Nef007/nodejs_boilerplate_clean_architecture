// import nodemailerMock          from 'nodemailer-mock';
// import StoredTriggerableAction from '../../lib/domain-model/StoredTriggerableAction.mjs';

import User from '../../lib/domain-model/User.mjs'
import users from '../fixtures/data/users.json' assert { type: 'json' }
import Task from '../../lib/domain-model/Task.mjs';
import tasks from '../fixtures/data/tasks.json' assert { type: 'json' };
import Token from '../../lib/domain-model/Token.mjs'

class TestFactory {
async setupTasks(users) {
    const savedTasks = await Task.bulkCreate(tasks.map((task, index) => ({...task, userId: users[index].id})));
    return savedTasks;
}
async setupTokens(users) {
    const savedTokens = await Token.bulkCreate(users.map(user => ({refreshToken: user.tokens.refreshToken , userId: user.id})));
    return savedTokens;
}

    async setupUsers() {

        const savedUsers = await User.bulkCreate(users)

        return savedUsers
    }
    //
    // async setupTokens() {
    //     const savedTokens = await Token.bulkCreate(tokens)
    //
    //
    //     return savedTokens
    // }
    // async setupAdmins() {
    //     const savedAdmins = await Admin.bulkCreate(admins);
    //
    //     return savedAdmins;
    // }


   // async setupActions(userId, adminId) {
        // const actions = [
        //     {
        //         type    : 'ACTIVATE_USER',
        //         payload : { userId }
        //     },
        //     {
        //         type    : 'RESET_USER_PASSWORD',
        //         payload : { userId }
        //     },
        //     {
        //         type    : 'RESET_ADMIN_PASSWORD',
        //         payload : { adminId }
        //     }
        // ];
        // const savedActions = await StoredTriggerableAction.bulkCreate(actions);

        // return savedActions;
      //  return 0
    //}

    async standardSetup() {
        // nodemailerMock.mock.reset();
    }
}

export default TestFactory
