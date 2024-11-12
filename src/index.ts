import { app } from './app';
import { connectToDb } from './DB';

const PORT = process.env.PORT || 8000;

app.listen(PORT, async () => {
  await connectToDb();
  console.log(`Server is running on port ${PORT}`);
});
