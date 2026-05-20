import User from "../models/User.js";

export const assignRoutine = async (req, res) => {
  try {
    const { userId, routineId, expirationDate  } = req.body;

     // 1. Validar que la fecha exista y sea un formato válido
    const fecha = new Date(expirationDate);
    if (isNaN(fecha.getTime())) {
      return res.status(400).json({ message: "La fecha proporcionada no es válida." });
    }

    // 2. Validar que no sea una fecha pasada
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (fecha < hoy) {
      return res.status(400).json({ message: "La fecha de caducidad debe ser futura." });
    }
    
    const user = await User.findByIdAndUpdate(
       userId,
        { 
          routine: routineId ,
          routineExpiration: expirationDate
        },
       { new: true } 
      ).populate("routine");

    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};
// export const getMyRoutine = async (req, res) => {
//   const user = await User.findById(req.user.id).populate("routine");
//   res.json(user.routine);
// };
export const getMyRoutine = async (req, res) => {
  try {
    
     const user = await User.findById(req.user.id)
      .select("routine routineExpiration") // Trae solo lo necesario de User
      .populate({
        path: "routine",
        populate: {
          path: "days.exercises.exercise",
          select: "name group"
        }
      });

    // Enviamos la rutina y la fecha de expiración juntas
    res.json({
      routine: user.routine,
      expirationDate: user.routineExpiration
    });

  } catch (err) {
    console.log(err);
    res.status(500).json("Error");
  }
};

export const getAllUser = async (req, res) => {
  const user = await User.find().populate("routine")
  res.json(user);
};

export const getUsers = async (req, res) => {
   let user;

   if (req.user.role === "Admin") {
     user = await User.find().populate("routine");
   } else if (req.user.role === "coach") {
     user = await User.find({ coach: req.user.id }).populate("routine");
   }

  res.json(user);
};
export const assignCoach = async (req, res) => {
  const { userId, coachId } = req.body;

  const user = await User.findByIdAndUpdate(
    userId,
    { coach: coachId },
    { new: true }
  );

  res.json(user);
};