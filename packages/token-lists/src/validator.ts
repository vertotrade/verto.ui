import Ajv from 'ajv'
import schema from './schema/vertotrade.json'

export const tokenListValidator = new Ajv({ allErrors: true }).compile(schema)
