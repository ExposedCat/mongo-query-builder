import { Query, NumberQuery, Value } from './types.js'

class QueryStage {
	// Aggregation
	static match = (query: Query) => ({ $match: query })
	static project = (projection: Query) => ({ $project: projection })
	static group = (query: Query) => ({ $group: query })
	static set = (data: Query) => ({ $set: data })
	static setOnInsert = (data: Query) => ({ $setOnInsert: data })
	static limit = (limit: number) => ({ $limit: limit })
	static addFields = (data: Query) => ({ $addFields: data })
	// Misc
	static upsert = { upsert: true }
	static in = (array: Value[]) => ({ $in: array })
	static ne = (value: Value) => ({ $ne: value })
	// Arrays
	static elemMatch = (query: Query) => ({ $elemMatch: query })
	static sort = (arrayPath: string, order: 1 | -1) => ({
		$sort: { [arrayPath]: order }
	})
	static unwind = (arrayPath: string) => ({ $unwind: arrayPath })
	static size = (arrayPath: string) => ({ $size: arrayPath })
	static arrayElemAt = (arrayPath: string, index: NumberQuery) => ({
		$arrayElemAt: [`$${arrayPath}`, index]
	})
	static indexOfArray = (arrayPath: string, value: Value) => ({
		$indexOfArray: [arrayPath, value]
	})
	static push = (arrayPath: string, entity: Value) => ({
		$push: { [arrayPath]: entity }
	})
	static slice = (arrayPath: string, elementsNumber: NumberQuery) => ({
		$slice: [`$${arrayPath}`, elementsNumber]
	})
	// Math
	static round = (value: NumberQuery, place: NumberQuery) => ({
		round: [value, place]
	})
	static ceil = (value: NumberQuery) => ({ $ceil: value })
	static subtract = (diminutive: NumberQuery, subtractive: NumberQuery) => ({
		subtract: [diminutive, subtractive]
	})
	static sum = (summand1: NumberQuery, summand2: NumberQuery) => ({
		$sum: [summand1, summand2]
	})
	static avg = (arrayPath: string) => ({ avg: `$${arrayPath}` })
	static divide = (dividend: NumberQuery, divisor: NumberQuery) => ({
		$divide: [dividend, divisor]
	})
	static inc = (path: string, value: number) => ({ inc: { [path]: value } })
}

class MathStage {
	private static object(field: string, value: Value) {
		return { [field]: value }
	}

	static size(arrayPath: string) {
		return new MathQueryObject(this.object('$size', `$${arrayPath}`))
	}

	static divide(dividend: Value, divisor: Value) {
		return new MathQueryObject(this.object('$divide', [dividend, divisor]))
	}
}

class MathQueryObject {
	private _object: Value

	constructor(base: Value = {}) {
		this._object = base
	}

	get $() {
		return this.object
	}

	private get object() {
		return this._object
	}

	private set object(value) {
		this._object = value
	}

	private wrapObject(key: string, wrapper?: (object: Value) => Value) {
		let compiledValue = this.object
		if (wrapper !== undefined) {
			compiledValue = wrapper(this.object)
		}
		this.object = {
			[key]: compiledValue
		}
		return this
	}

	divide(divisor: Value) {
		return this.wrapObject('$divide', current => [current, divisor])
	}

	add(summand: Value) {
		return this.wrapObject('$add', current => [current, summand])
	}

	ceil() {
		return this.wrapObject('$ceil')
	}
}

export { QueryStage, MathStage }
