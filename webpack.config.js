const path = require( 'path' );
const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );

const fantaptikWebpack = require( '@fantaptik/webpack-react' );

module.exports = {
    entry : "./src/index.js",
    stats : {
        ...fantaptikWebpack.stats,
    },
    externals : {
        ...fantaptikWebpack.externals,
    },
    output : {
        filename : "index.js",
        path : path.resolve( __dirname, "dist" ),
        library : "FantaptikSocket",
        libraryTarget : "umd",
    },
    plugins : [
        // Clean dist for every build.
        new CleanWebpackPlugin(),
    ],
    resolve : {
        symlinks : false,
    },
    module : {
        rules : [
            // {
            //     test : /\.css$/,
            //     use : [ 'style-loader', 'css-loader' ],
            // },
            // TODO RM
            // {
            //     test : /\.(woff|woff2|eot|ttf|otf)$/,
            //     use : {
            //         loader : 'file-loader',
            //         options : {
            //             publicPath : fontPath,
            //         },
            //     },
            // },
            {
                test : /\.js$/,
                exclude : /[\\/]node_modules[\\/]/,
                use : {
                    loader: 'babel-loader',
                    options : {
                        plugins : [ '@babel/plugin-proposal-class-properties' ],
                        presets : [ '@babel/preset-env' ],
                    },
                },
            },
        ],
    }
}