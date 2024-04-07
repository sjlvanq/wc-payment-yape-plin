import React, { useState } from 'react';
import { Input, Button, Box, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Compressor from 'compressorjs';


const ReceiptUpload = ({ onReceiptUrlChange, endpoint, nonce }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [receiptFileUrl, setReceiptFileUrl] = useState(null);
  const [error, setError] = useState(null);
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    setIsLoading(false);
    setIsLoaded(false);
    setError(null);
  };
  
  const compressImage = () => {
    new Compressor(selectedImage, {
    quality: 0.8,
    success(compressedResult) {
      uploadImage(compressedResult)
    },
    error(err) {
      var pre = "";
      if(err.message.includes("must be an image")){
        pre = "Formato de imagen no reconocido. ";
      } else {
        pre = "Error desconocido. ";
      }
      setError(pre + "Por favor, inténtelo nuevamente. Si el problema persiste y usted ya realizó la transferencia, seleccione 'Pago en efectivo'.");
      console.log(err);
    },
    });
  };

  const uploadImage = async (compressedResult) => {
    try {
      const formData = new FormData();
      formData.append('file', compressedResult, selectedImage.name);
      formData.append('nonce', nonce)
      setIsLoading(true);
      fetch(endpoint, {
        method: "POST",
        headers: {},
        body: formData
      })
        .then(response => response.json())
        .then(data => {
            const { success, imageUrl, message } = data;
            setIsLoaded(success);
            setReceiptFileUrl(imageUrl);
            onReceiptUrlChange(imageUrl);
            if(!success){
              setError(message);
            }
        })
        .catch(error => {
            setError("Error desconocido. Por favor, inténtelo nuevamente. Si el problema persiste y usted ya realizó la transferencia, seleccione 'Pago en efectivo'.");
        })
        .finally(() => {setIsLoading(false)});
    } catch (error) {
      setError("Error desconocido. Por favor, inténtelo nuevamente. Si el problema persiste y usted ya realizó la transferencia, seleccione 'Pago en efectivo'.");
    }
  };

  const handleUpload = async () => {
    setError(null);
    compressImage();
  };

  const isButtonEnabled = selectedImage !== null && !isLoaded && !isLoading;
  return (
    <>
    <Box>
      <Input type="file" onChange={handleImageChange} inputProps={{ accept: 'image/*' }} />
      <Input type="hidden" name="receipt_file" id="receipt_file" value={receiptFileUrl} />
      { isLoading ?  
        <CircularProgress /> : 
        <Button 
          variant="contained" 
          color={isLoaded ? "success" : "primary"} 
          onClick={handleUpload} 
          disabled={!isButtonEnabled}
        >
          {isLoaded ? <CheckCircleIcon size={20} /> : "Cargar"}
        </Button>
      }
    </Box>
    {error && <Typography color="error">{error}</Typography>}
    </>
  );
};

export default ReceiptUpload;
