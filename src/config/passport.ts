import passport from 'passport';
import { Connect, MutlipleQuery, EndConnection } from '../utils/db';
import { Strategy as TwitterStrategy } from 'passport-twitter';

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
    try {
        const connection: any = await Connect();
        const isInDb = await MutlipleQuery(connection, `SELECT COUNT(*) as isInDb FROM vuilders WHERE twitter_id = ${obj._json.id}`);
        if (!isInDb[0].isInDb) {
            // User not in database you need to add it then return the user via done
            await MutlipleQuery(connection, `INSERT INTO vuilders (twitter_id, twitter_tag, avatar, bio, has_mint, mint_hash, address) VALUES (?, ?, ?, ?, ?, ?, ?)`, [
                obj._json.id,
                obj._json.screen_name,
                obj._json.profile_image_url,
                obj._json.description,
                0,
                null,
                null
            ]);
            EndConnection(connection);
            done(null, {
                twitter_id: obj._json.id,
                twitter_tag: obj._json.screen_name,
                avatar: obj._json.profile_image_url,
                bio: obj._json.description,
                has_mint: 0,
                mint_hash: null,
                address: null
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
