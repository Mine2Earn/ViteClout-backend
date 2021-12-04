export default function isLoggedIn(req: any, res: any, next: any) {
    req.user ? next() : res.status(401).json({ message: "You're not logged in" });
}
