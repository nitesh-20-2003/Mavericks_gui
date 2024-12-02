import path from "path";
import fs from "fs";

// Helper function to generate random descriptions
const generateRandomDescription = () => {
  const descriptions = [
    "This is a beautiful image captured in nature.",
    "A stunning photo showcasing vibrant colors.",
    "A scenic view that captures the essence of peace.",
    "This image tells a story of serenity and calm.",
    "A unique shot with beautiful lighting and contrasts.",
    "A wonderful view of the world through a lens.",
    "An incredible moment captured in time.",
    "This image evokes a sense of adventure.",
    "A captivating landscape that inspires wanderlust.",
    "A picture-perfect shot of nature's beauty.",
  ];
  const randomIndex = Math.floor(Math.random() * descriptions.length);
  return descriptions[randomIndex];
};

export const getImages = (req, res) => {
  const imageFiles = [];
  const imageDirectory = path.join(process.cwd(), "oneto9");

  try {
    const files = fs.readdirSync(imageDirectory);

    files.forEach((file) => {
      const filePath = path.join(imageDirectory, file);
      const extname = path.extname(file).toLowerCase();

      if (
        extname === ".jpg" ||
        extname === ".jpeg" ||
        extname === ".png" ||
        extname === ".gif"
      ) {
        const name = file.split(".")[0];
        const imageObject = {
          name,
          description: generateRandomDescription(),
          image: `/oneto9/${file}`,
        };

        imageFiles.push(imageObject);
      }
    });
    res.json({ images: imageFiles });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error reading image directory", error: error.message });
  }
};
