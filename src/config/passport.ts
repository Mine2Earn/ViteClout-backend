import passport from 'passport';
import { Connect, MutlipleQuery, EndConnection } from '../utils/db';
import { Strategy as TwitterStrategy } from 'passport-twitter';

const VUILDERS = [
    'VitealnuCoin',
    'TurkeyVite',
    'ViteTipBot',
    'vite_india',
    'vitctipbot',
    '1appleaday_vitc',
    'VITEtools',
    'ViteBizDevComms',
    'WesEricksonPhD',
    'vite_news',
    'Vite_LabsArabic',
    'ekazukiii',
    'krystalvite',
    'vite_vietnamese',
    'MathisObstinate',
    'Gentso09',
    'VitcKript'
];

passport.use(
    new TwitterStrategy(
        {
            consumerKey: process.env.TWITTER_CONSUMER_KEY,
            consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
            callbackURL: process.env.TWITTER_CALLBACK_URL
        },
        (token, tokenSecret, profile, done) => {
            done(null, profile);
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser(async (obj: any, done) => {
    // Change the user object
    // USERNAME twitter_tag
    // isVuilder isVuilder
    try {
        const connection: any = await Connect();
        const isInDb = await MutlipleQuery(connection, `SELECT COUNT(*) as isInDb FROM vuilders WHERE twitter_id = ${obj._json.id}`);
        if (!isInDb[0].isInDb) {
            // User not in database you need to add it then return the user via done
            await MutlipleQuery(
                connection,
                `INSERT INTO vuilders (twitter_id, twitter_tag, twitter_name, avatar, bio, has_mint, mint_hash, address, isVuilder) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    obj._json.id,
                    obj._json.screen_name,
                    obj._json.name,
                    obj._json.profile_image_url.replace('normal', '400x400'),
                    obj._json.description,
                    0,
                    null,
                    null,
                    VUILDERS.includes(obj._json.screen_name) ? 1 : 0
                ]
            );
            EndConnection(connection);
            done(null, {
                twitter_id: obj._json.id,
                twitter_tag: obj._json.screen_name,
                twitter_name: obj._json.name,
                avatar: obj._json.profile_image_url.replace('normal', '400x400'),
                bio: obj._json.description,
                has_mint: 0,
                mint_hash: null,
                address: null,
                isVuilder: VUILDERS.includes(obj._json.screen_name) ? 1 : 0
            });
        } else {
            // Get user in the database
            const res: any = await MutlipleQuery(connection, `SELECT * FROM vuilders WHERE twitter_id = ?`, [obj._json.id]);
            EndConnection(connection);
            done(null, res[0]);
        }
    } catch (error) {
        console.log(error);
        done('Error logging. Please retry.');
    }
});

export default passport;
