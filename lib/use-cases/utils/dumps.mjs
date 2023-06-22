

export function dumpUser(user) {
    const dump = {
        id         : user.id,
        email      : user.email,
        firstName  : user.firstName,
        secondName : user.secondName,
        patronymic : user.patronymic,
        status     : user.status,
        // avatarUrl  : user.avatar ? generateImagesURL(user.avatar) : '',
        // lang       : user.lang,
        createdAt  : user.createdAt.toISOString(),
        updatedAt  : user.updatedAt.toISOString()
    }

    return dump
}


export function dumpDepartment(department) {
    const dump = {
        id        : department.id,
        shortName : department.shortName,
        fullName  : department.fullName,
        createdAt : department.createdAt.toISOString(),
        updatedAt : department.updatedAt.toISOString()
    }

    return dump
}


export function dumpTask(task) {
    const dump = {
        id          : task.id,
        shortName   : task.shortName,
        description : task.description,
        status      : task.status,
        userId      : task.userId,
        createdAt   : task.createdAt.toISOString(),
        updatedAt   : task.updatedAt.toISOString()
    }

    return dump
}
