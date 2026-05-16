import express from 'express'; 
import { ENV } from './config/env.js'; 
import { db } from './config/db.js';
import { favouritesTable } from './db/schema.js';
import { and, eq } from 'drizzle-orm';

const app = express();
const PORT = process.env.PORT || 3000; 

app.use(express.json());

app.get("/api/health", (req,res) => {
  res.status(200).json({ success:true });
})

app.post("/api/favourites", async (req,res) => {
 try {
   const { userId, recipeId, title, image, cookTime, servings } = req.body;

   if (!userId || !recipeId || !title) {
     return res.status(400).json({ success: false, message: "Missing required fields" });
   }

    const newFavourite = await db.insert(favouritesTable).values({
      userId,
      recipeId,
      title,
      image,
      cookTime,
      servings
   })
   .returning();

   res.status(201).json({ success: true, data: newFavourite[0] });
 } catch (error) {
   console.log("error adding favourites", error);
   res.status(500).json({ success: false, message: "something went wrong" });
 }
})

app.get("/api/favourites/:userId", async (req,res) => {

try {
  const {userId} = req.params;

 const favourites = await db.select().from(favouritesTable).where(eq(favouritesTable.userId, userId));

 res.status(200).json({ success: true, data: favourites });
} catch (error) {
   console.log("error fetching the favourites", error);
   res.status(500).json({ success: false, message: "something went wrong" });
}

})

app.delete("/api/favourites/:userId/:recipeId",async (req,res) => {
  try {
    const { userId, recipeId } = req.params;

    await db.delete(favouritesTable).where(
      and(eq(favouritesTable.userId,userId), eq(favouritesTable.recipeId, parseInt(recipeId)))
    )

    res.status(200).json({ success: true, message: "favourite deleted successfully" });

  } catch (error) {
    console.log("error deleting the favourites", error);
   res.status(500).json({ success: false, message: "something went wrong" });
  }
})

app.listen(PORT, () => {
  console.log('Server is running on PORT:', PORT);
});