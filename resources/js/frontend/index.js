import { useEffect, useState } from 'react';
import { sprintf, __ } from '@wordpress/i18n';
import { registerPaymentMethod } from '@woocommerce/blocks-registry';
import { decodeEntities } from '@wordpress/html-entities';
import { getSetting } from '@woocommerce/settings';

import { Grid, Typography } from '@mui/material';
import AccountTable from './AccountTable';
import ReceiptUpload from './ReceiptUpload';
import yapeqr from './yapeqr.jpg';
import plinqr from './plinqr.jpg';

const settings = getSetting( 'dummy_data', {} );

const defaultLabel = __(
	'Dummy Payments',
	'woo-gutenberg-products-block'
);

const label = decodeEntities( settings.title ) || defaultLabel;

/**
 * Content component
 */
const Content = (props) => {
	const { eventRegistration, emitResponse } = props;
	const { onPaymentSetup } = eventRegistration;
	
	const [receiptUrl, setReceiptUrl] = useState('');
	const handleReceiptUrlChange = (data) => {setReceiptUrl(data);}

	useEffect( () => {
		const unsubscribe = onPaymentSetup( async () => {
			const gtwData_receiptUrl = receiptUrl;
			const customDataIsValid = !! gtwData_receiptUrl.length;

			if ( customDataIsValid ) {
				return {
					type: emitResponse.responseTypes.SUCCESS,
					meta: {
						paymentMethodData: {
							gtwData_receiptUrl,
						},
					},
				};
			}
			return {
				type: emitResponse.responseTypes.ERROR,
				message: 'Debe cargar el comprobante de pago.',
			};
		} );
		// Unsubscribes when this component is unmounted.
		return () => {
			unsubscribe();
		};
	}, [
		emitResponse.responseTypes.ERROR,
		emitResponse.responseTypes.SUCCESS,
		onPaymentSetup,
		receiptUrl
	] );
	return (
    <Grid container spacing={2}>
      <Grid item xs={12} container direction="column" alignItems="center">
        <Typography variant="body1" gutterBottom>
          Escanee el código QR o envíe su transferencia a: 
        </Typography>
		<AccountTable settings={settings} />
      </Grid>
      <Grid item xs={6} container direction="column" alignItems="center">
        <img src={yapeqr} height={200} width={200} alt="YAPE QR" />
        <Typography variant="h5" gutterBottom>
          YAPE
        </Typography>
      </Grid>
      <Grid item xs={6} container direction="column" alignItems="center">
        <img src={plinqr} height={200} width={200} alt="PLIN QR" />
        <Typography variant="h5" gutterBottom>
          PLIN
        </Typography>
      </Grid>
      <Grid item xs={12} container direction="column" alignItems="center">
		<Typography variant="body1" gutterBottom>
			Después de realizar su pago por el monto correspondiente, <Typography component="span" sx={{fontWeight:'bold'}}>adjunte 
			el comprobante o una captura de pantalla</Typography> a continuación:
		</Typography>
		<ReceiptUpload onReceiptUrlChange={handleReceiptUrlChange} endpoint={settings.endpoint} nonce={settings.nonce} />
		
	  </Grid>
    </Grid>
	)
};
/**
 * Label component
 *
 * @param {*} props Props from payment API.
 */
const Label = ( props ) => {
	const { PaymentMethodLabel } = props.components;
	return <PaymentMethodLabel text={ label } />;
};

/**
 * Dummy payment method config object.
 */
const Dummy = {
	name: "dummy",
	label: <Label />,
	content: <Content />,
	edit: <Content />,
	canMakePayment: () => true,
	ariaLabel: label,
	supports: {
		features: settings.supports,
	},
};

registerPaymentMethod( Dummy );
