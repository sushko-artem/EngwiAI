export const translate = async (text: string) => {
  try {
    const response = await fetch(
      `https://ftapi.pythonanywhere.com/translate?dl=en&text=${text}`
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
};
