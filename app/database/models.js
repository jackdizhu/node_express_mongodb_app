
module.exports = {
    user:{
        name:{type:String,required:true},
        password:{type:String,required:true}
    },
    link:{
        name:{type:String,required:true},
        links:{type:Object,required:false}
    }
};
