const express = require("express");
const router = express.Router();

const { pool } = require("../config/db");


// =========================================
// GET ADMIN NOTIFICATIONS
// =========================================

router.get("/", async (req, res) => {

  try {

    const [notifications] = await pool.query(`
      SELECT
        id,
        title,
        message,
        type,
        is_read,
        created_at

      FROM admin_notifications

      ORDER BY created_at DESC
    `);


    const unreadCount =
      notifications.filter(
        (notification) =>
          !notification.is_read
      ).length;


    res.json({

      notifications,

      unreadCount,

    });


  } catch (error) {

    console.error(
      "Get admin notifications error:"
    );

    console.error(error);


    res.status(500).json({

      message:
        "Unable to retrieve admin notifications.",

      error:
        error.message,

    });

  }

});


// =========================================
// GET UNREAD COUNT
// =========================================

router.get(
  "/unread-count",
  async (req, res) => {

    try {

      const [result] =
        await pool.query(`

          SELECT
            COUNT(*) AS unreadCount

          FROM admin_notifications

          WHERE is_read = FALSE

        `);


      res.json({

        unreadCount:
          Number(
            result[0].unreadCount
          ) || 0,

      });


    } catch (error) {

      console.error(
        "Admin unread count error:"
      );

      console.error(error);


      res.status(500).json({

        message:
          "Unable to retrieve unread count.",

        error:
          error.message,

      });

    }

  }
);


// =========================================
// MARK ONE AS READ
// =========================================

router.put(
  "/:id/read",
  async (req, res) => {

    try {

      const { id } = req.params;


      const [result] =
        await pool.query(

          `UPDATE admin_notifications

           SET is_read = TRUE

           WHERE id = ?`,

          [id]

        );


      if (
        result.affectedRows === 0
      ) {

        return res.status(404).json({

          message:
            "Notification not found.",

        });

      }


      res.json({

        message:
          "Notification marked as read.",

      });


    } catch (error) {

      console.error(
        "Mark admin notification read error:"
      );

      console.error(error);


      res.status(500).json({

        message:
          "Unable to update notification.",

        error:
          error.message,

      });

    }

  }
);


// =========================================
// MARK ALL AS READ
// =========================================

router.put(
  "/read-all",
  async (req, res) => {

    try {

      await pool.query(`

        UPDATE admin_notifications

        SET is_read = TRUE

        WHERE is_read = FALSE

      `);


      res.json({

        message:
          "All notifications marked as read.",

      });


    } catch (error) {

      console.error(
        "Mark all admin notifications error:"
      );

      console.error(error);


      res.status(500).json({

        message:
          "Unable to update notifications.",

        error:
          error.message,

      });

    }

  }
);


// =========================================
// DELETE ONE
// =========================================

router.delete(
  "/:id",
  async (req, res) => {

    try {

      const { id } = req.params;


      const [result] =
        await pool.query(

          `DELETE FROM admin_notifications

           WHERE id = ?`,

          [id]

        );


      if (
        result.affectedRows === 0
      ) {

        return res.status(404).json({

          message:
            "Notification not found.",

        });

      }


      res.json({

        message:
          "Notification deleted successfully.",

      });


    } catch (error) {

      console.error(
        "Delete admin notification error:"
      );

      console.error(error);


      res.status(500).json({

        message:
          "Unable to delete notification.",

        error:
          error.message,

      });

    }

  }
);


// =========================================
// DELETE ALL
// =========================================

router.delete(
  "/",
  async (req, res) => {

    try {

      await pool.query(`

        DELETE FROM admin_notifications

      `);


      res.json({

        message:
          "All notifications cleared successfully.",

      });


    } catch (error) {

      console.error(
        "Clear admin notifications error:"
      );

      console.error(error);


      res.status(500).json({

        message:
          "Unable to clear notifications.",

        error:
          error.message,

      });

    }

  }
);


module.exports = router;