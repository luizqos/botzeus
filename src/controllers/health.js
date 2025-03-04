class HealthController {
  static async check(_req, res) {
    try {
      return res.json({status: 'OK'});
    } catch (error) {
      return res
        .status(500)
        .json({ error: JSON.stringify(error) });
    }
  }
}

module.exports = HealthController;
