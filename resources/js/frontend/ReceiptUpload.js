import React, { useState } from 'react';
import { Input, Button, Box, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


const ReceiptUpload = ({ onReceiptUrlChange, endpoint }) => {
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
  
  const handleUpload = async () => {      
    try {
      // Crea un objeto FormData para enviar la imagen
      const formData = new FormData();
      formData.append('file', selectedImage);
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
  const isButtonEnabled = selectedImage !== null && !isLoaded && !isLoading;
  return (
    <>
    <Box>
      <Input type="file" onChange={handleImageChange} inputProps={{ accept: 'image/*,application/pdf' }} />
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
