type Query = { [key: string]: Value }
type NumberQuery = number | Query
type Value = number | boolean | string | Date | Array<Value> | Query

export { Query, NumberQuery, Value }
