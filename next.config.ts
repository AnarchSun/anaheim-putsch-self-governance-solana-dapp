import path from 'path';

module.exports = {
    webpack: (config: any) => {
        config.resolve.extensions = ['.ts', '.tsx', '.js', '.json'];
        config.module.rules.push({
            test: /\.(ts|tsx)$/,
            include: [
                path.resolve(__dirname, 'node_modules/gill-monorepo'),
                path.resolve(__dirname, 'node_modules/.pnpm/gill-monorepo@https+++codeload.github.com+codebender828+gill+tar.gz+00ff51501ff0bd141bcefa40a992059b51c98a1c/node_modules/gill-monorepo'),
            ],
            use: [
                {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            'next/babel',
                            '@babel/preset-typescript',
                        ],
                    },
                },
            ],
        });
        config.resolve.alias['@'] = path.resolve(__dirname, 'src');
        // ... autres alias
        return config;
    },
};