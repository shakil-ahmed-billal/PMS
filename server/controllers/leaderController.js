import Project from "../models/Project.js";

//  GET /api/leader/stats
export const getLeaderStats = async (req, res) => {
  try {
    const allProjects = await Project.find();

    const totalProjects = allProjects.length;
    const totalAmount = allProjects.reduce((a, p) => a + p.amount, 0);
    const pending = allProjects.filter(p => p.status === "Pending");
    const completed = allProjects.filter(p => p.status === "Completed");
    const cancelled = allProjects.filter(p => p.status === "Cancelled");

    const pendingAmount = pending.reduce((a, p) => a + p.amount, 0);
    const completedAmount = completed.reduce((a, p) => a + p.amount, 0);
    const cancelledAmount = cancelled.reduce((a, p) => a + p.amount, 0);

    // Example monthly grouping by createdAt month
    const monthly = {};
    allProjects.forEach(p => {
      const m = new Date(p.createdAt).toLocaleString("default", { month: "short" });
      monthly[m] = (monthly[m] || 0) + p.amount;
    });

    res.json({
      totalProjects,
      totalAmount,
      pendingAmount,
      completedAmount,
      cancelledAmount,
      monthly,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
