export const isLeader = (req, res, next) => {
  if (req.user.role !== "Leader") {
    return res.status(403).json({ message: "Access Denied: Leaders Only" });
  }
  next();
};

export const isMember = (req, res, next) => {
  if (req.user.role !== "Member") {
    return res.status(403).json({ message: "Access Denied: Members Only" });
  }
  next();
};
