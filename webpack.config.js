const path = require('path');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  	mode: 'production',
  	entry: './resources/scripts/_index.js',
  	module: {
    	rules: [
      		{
        		test: /\.css$/i,
        		use: [MiniCssExtractPlugin.loader, "css-loader"],
      		},
      		{
        		test: /\.js$/i,
				use: {
          			loader: 'babel-loader',
          			options: {
            			presets: ['@babel/preset-env']
          			}
        		}
      		}
    	],
  	},
  	output: {
    	filename: 'scripts/app.js',
    	path: path.resolve(__dirname, 'public/'),
  	},
  	optimization: {
    	minimizer: [ 
			new CssMinimizerPlugin(),
			new TerserPlugin()
		],
    	minimize: true
  	},
  	plugins: [
		new MiniCssExtractPlugin({ filename: 'styles/main.css' })
	]
};