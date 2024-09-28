class ApiFilters{
  query : any
  queryStr : any

  constructor(query : any , queryStr : any) {
    this.query = query
    this.queryStr = queryStr
  }

  search() : ApiFilters{
    const location = this.queryStr?.location ? 
    {
      address : {
        $regex : this.queryStr.location,
        $options : "i"
      },
    } : {}
    
    this.query = this.query.find({...location})
    return this
  }

  Filter() : ApiFilters{
    //create a querycopy
    const queryCopy = {...this.queryStr}
    
    const removeFields = ["location", 'page']
    removeFields.forEach((field) => delete queryCopy[field])

    this.query = this.query.find(queryCopy)
    
    return this
  }

  Pagination(resPerPage : number) : ApiFilters{
    const currentPage = Number(this.queryStr?.page) || 1
    const skip = resPerPage * (currentPage - 1)

    this.query = this.query.limit(resPerPage).skip(skip)
    return this
  }
}

export default ApiFilters