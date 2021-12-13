export default function isLoggedIn(req: any, res: any, next: any) {
    console.log('not logged in');
    return req.user ? next() : res.status(401).json({ message: "You're not logged in" });
}
