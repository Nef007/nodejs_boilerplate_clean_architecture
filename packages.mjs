import { DataTypes as _DataTypes, Op as _Op }   from 'sequelize'
import _bluebird    from 'bluebird'
import _docopt      from 'docopt'
import _ServiceBase from './kernel/ServiceBase.mjs'
import _Exception   from './kernel/Exception.mjs'

export const UseCaseBase  = _ServiceBase
export const Exception    = _Exception
export const DataTypes    = _DataTypes


export const Op           = _Op
// export const promisifyAll = _bluebird.promisifyAll;
export const promisify    = _bluebird.promisify
export const docopt       = _docopt.docopt
