import { ChakraProvider, Heading, Container, Text, Input, Button, Wrap, Image, SkeletonCircle, SkeletonText, Stack } from "@chakra-ui/react"
import axios from "axios"
import { useState } from "react"

const App = () => {
  const [image, updateImage] = useState();
  const [prompt, updatePrompt] = useState();
  const [loading, updateLoading] = useState();

  const generateStableDiffusion = async (prompt) => {
    updateLoading(true);
    try {
      const result = await axios.post("http://127.0.0.1:8000/stable-diffusion", { prompt: prompt });
      updateImage(result.data);
    } catch (error) {
      console.error("Błąd w generowaniu obrazu dla Stable Diffusion:", error);
    }
    updateLoading(false);
  }

  const generateDALLE = async (prompt) => {
    updateLoading(true);
    try {
      const result = await axios.post("http://127.0.0.1:8000/dalle", { prompt: prompt });
      updateImage(result.data.image_url);
    } catch (error) {
      console.error("Błąd w generowaniu obrazu dla DALL-E-2:", error);
    }
    updateLoading(false);
  }

  return (
    <ChakraProvider>
      <Container>
        <Heading marginTop={"20px"}>Generatory obrazów</Heading>
        <Wrap marginBottom={"10px"}>
          <Input value={prompt} onChange={(e) => updatePrompt(e.target.value)} width={"350px"}></Input>
          <Button onClick={() => generateStableDiffusion(prompt)} colorScheme={"yellow"}>Generuj (Stable Diffusion)</Button>
          <Button onClick={() => generateDALLE(prompt)} colorScheme={"blue"}>Generuj (DALL-E-2)</Button>
        </Wrap>

        {loading ? (
          <Stack>
            <SkeletonCircle />
            <SkeletonText />
          </Stack>
        ) : image ? (
          <Image src={`data:image/png;base64,${image}`} boxShadow="lg" />
        ) : null}

      </Container>
    </ChakraProvider>
  )
}

export default App
