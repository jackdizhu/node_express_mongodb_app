var path=require('path');
var webpack = require('webpack');

var basePath = './app/public/';

module.exports = {
    entry: {
    		index: basePath + "src/index.js"
    	},
    output: {
        path: path.join(__dirname,'dist'),
        publicPath: basePath + "dist/",
        filename: "[name].js",
        chunkFilename: "[id].chunk.js"
    },
    module: {
        loaders: [	//加载器
            {test: /\.css$/, loader: "style!css" },
            {test: /\.html$/, loader: "html" },
            {test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
        ]
    },
    plugins:[
    	// new webpack.ProvidePlugin({	//加载jq
     //        $: 'jquery'
     //    }),
  //       new webpack.optimize.UglifyJsPlugin({	//压缩代码
		//     compress: {
		//         warnings: false
		//     },
		//     except: ['$super', '$', 'exports', 'require']	//排除关键字
		// }),
		// new webpack.optimize.CommonsChunkPlugin("commons.js", ["index", "delegate"])
    ]
};
