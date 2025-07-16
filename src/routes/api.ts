import { AppError, asyncHandler } from "@/middleware/errorHandler";
import { validateRequest } from "@/middleware/validation";
import { userService } from "@/services/userServive";
import { logger } from "@/utils/logger";
import { Router, Request, Response } from "express";

const router = Router();

// Your existing greeting endpoint
router.get(
  "/greeting",
  asyncHandler(async (req: Request, res: Response) => {
    logger.info("Greeting endpoint called", { requestId: req.requestId });

    res.json({
      message: "Hello from the TypeScript App!",
      served_at: new Date().toISOString(),
      request_id: req.requestId,
    });
  }),
);

// Example user endpoints
router.get(
  "/users",
  asyncHandler(async (_: Request, res: Response) => {
    const users = await userService.getAllUsers();

    res.json({
      success: true,
      data: users,
      timestamp: new Date().toISOString(),
    });
  }),
);

router.get(
  "/users/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      throw new AppError("Invalid user ID", 400);
    }

    const user = await userService.getUserById(Number(id));

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.json({
      success: true,
      data: user,
      timestamp: new Date().toISOString(),
    });
  }),
);

router.post(
  "/users",
  validateRequest,
  asyncHandler(async (req: Request, res: Response) => {
    const userData = req.body;

    const newUser = await userService.createUser(userData);

    res.status(201).json({
      success: true,
      data: newUser,
      message: "User created successfully",
      timestamp: new Date().toISOString(),
    });
  }),
);

router.put(
  "/users/:id",
  validateRequest,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userData = req.body;

    if (!id || isNaN(Number(id))) {
      throw new AppError("Invalid user ID", 400);
    }

    const updatedUser = await userService.updateUser(Number(id), userData);

    if (!updatedUser) {
      throw new AppError("User not found", 404);
    }

    res.json({
      success: true,
      data: updatedUser,
      message: "User updated successfully",
      timestamp: new Date().toISOString(),
    });
  }),
);

router.delete(
  "/users/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      throw new AppError("Invalid user ID", 400);
    }

    const deleted = await userService.deleteUser(Number(id));

    if (!deleted) {
      throw new AppError("User not found", 404);
    }

    res.json({
      success: true,
      message: "User deleted successfully",
      timestamp: new Date().toISOString(),
    });
  }),
);

// Example endpoint that demonstrates error handling
router.get(
  "/error-example",
  asyncHandler(async (_: Request, __: Response) => {
    throw new AppError("This is an example error", 400);
  }),
);

export { router as apiRouter };
