const Product = require('../models/product')
const getAllProductsStatic = async(req,res)=>{
    // One can apply the properties of Schema as filters in find and limit the search
    const products = await Product.find({featured : true})
    res.status(200).json({products})
}

const getAllProducts = async(req,res)=>{
    const {featured,company,name,sort,fields,numericFilters} = req.query;
    const queryObject = {}  //this object is formed to avoid unknown queries

    if(featured){
       queryObject.featured = featured === 'true'? true:false
    }
    if(company){
        queryObject.company = company
    }
    if(name){
        // this is known as query operators. For eg this regex will help you find names that contain
        // the part of input query Lets say I pass 'e' , it will return me all the names which contain
        // e. The option used here is for case sensetive
        queryObject.name = { $regex : name, $options : 'i'}
    }
    if (numericFilters) {
        const operatorMap = {
          '>': '$gt',
          '>=': '$gte',
          '=': '$eq',
          '<': '$lt',
          '<=': '$lte',
        };
        const regEx = /\b(<|>|>=|=|<|<=)\b/g;
        let filters = numericFilters.replace(
          regEx,
          (match) => `-${operatorMap[match]}-`
        );
        const options = ['price', 'rating'];
        filters = filters.split(',').forEach((item) => {
          const [field, operator, value] = item.split('-');
          if (options.includes(field)) {
            queryObject[field] = { [operator]: Number(value) };
          }
        });
      }
    let result = Product.find(queryObject)  //this returns a promise object instead of list 
    if(sort){                               // necessary if you want to check sort variable
        const shortList = sort.split(',').join(' ');  //for removing comma from params
        result = result.sort(shortList)
    }
    else{
        result = result.sort('createdAt')
    }

    if(fields){
        const fieldsList = fields.split(',').join(' ')
        result = result.select(fieldsList)
    }
    // Something called as pagination 
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page -1) * limit

    result = result.skip(skip).limit(limit)

    const products = await result
    res.status(200).json({products})
}

module.exports = { 
    getAllProductsStatic,
    getAllProducts
}
