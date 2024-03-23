<?php
/**
 * WC_Gateway_Dummy class
 *
 * @author   SomewhereWarm <info@somewherewarm.gr>
 * @package  WooCommerce Dummy Payments Gateway
 * @since    1.0.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Dummy Gateway.
 *
 * @class    WC_Gateway_Dummy
 * @version  1.0.7
 */
class WC_Gateway_Dummy extends WC_Payment_Gateway {

	/**
	 * Payment gateway instructions.
	 * @var string
	 *
	 */
	protected $instructions;

	/**
	 * Whether the gateway is visible for non-admin users.
	 * @var boolean
	 *
	 */
	protected $hide_for_non_admin_users;
	
	protected $requireReceipt;
	protected $ak;
	

	/**
	 * Unique id for the gateway.
	 * @var string
	 *
	 */
	public $id = 'dummy';

	/**
	 * Constructor for the gateway.
	 */
	public function __construct() {
		
		$this->icon               = apply_filters( 'woocommerce_dummy_gateway_icon', '' );
		$this->has_fields         = true;
		$this->supports           = array(
			'products'
		);

		$this->method_title       = _x( 'Dummy Payment', 'Dummy payment method', 'woocommerce-gateway-dummy' );

		// Load the settings.
		$this->init_form_fields();
		$this->init_settings();

		// Define user set variables.
		$this->title                    = $this->get_option( 'title' );
		$this->description              = $this->get_option( 'description' );
		$this->instructions             = $this->get_option( 'instructions', $this->description );
		$this->hide_for_non_admin_users = $this->get_option( 'hide_for_non_admin_users' );
		$this->requireReceipt			= $this->get_option( 'requireReceipt' );
		$this->bankAcct_alias			= $this->get_option( 'backAcct_alias' );
		$this->bankAcct_cci				= $this->get_option( 'backAcct_cci' );
		$this->bankAcct_holder			= $this->get_option( 'backAcct_holder' );
		
		// Actions.
		add_action( 'woocommerce_update_options_payment_gateways_' . $this->id, array( $this, 'process_admin_options' ) );
	}

	/**
	 * Initialise Gateway Settings Form Fields.
	 */
	public function init_form_fields() {

		$this->form_fields = array(
			'enabled' => array(
				'title'   => __( 'Enable/Disable', 'woocommerce-gateway-dummy' ),
				'type'    => 'checkbox',
				'label'   => __( 'Enable Dummy Payments', 'woocommerce-gateway-dummy' ),
				'default' => 'yes',
			),
			'hide_for_non_admin_users' => array(
				'type'    => 'checkbox',
				'label'   => __( 'Hide at checkout for non-admin users', 'woocommerce-gateway-dummy' ),
				'default' => 'no',
			),
			'title' => array(
				'title'       => __( 'Title', 'woocommerce-gateway-dummy' ),
				'type'        => 'text',
				'description' => __( 'This controls the title which the user sees during checkout.', 'woocommerce-gateway-dummy' ),
				'default'     => _x( 'Dummy Payment', 'Dummy payment method', 'woocommerce-gateway-dummy' ),
				'desc_tip'    => true,
			),
			'description' => array(
				'title'       => __( 'Description', 'woocommerce-gateway-dummy' ),
				'type'        => 'textarea',
				'description' => __( 'Payment method description that the customer will see on your checkout.', 'woocommerce-gateway-dummy' ),
				'default'     => __( 'The goods are yours. No money needed.', 'woocommerce-gateway-dummy' ),
				'desc_tip'    => true,
			),
			'result' => array(
				'title'    => __( 'Payment result', 'woocommerce-gateway-dummy' ),
				'desc'     => __( 'Determine if order payments are successful when using this gateway.', 'woocommerce-gateway-dummy' ),
				'id'       => 'woo_dummy_payment_result',
				'type'     => 'select',
				'options'  => array(
					'success'  => __( 'Success', 'woocommerce-gateway-dummy' ),
					'failure'  => __( 'Failure', 'woocommerce-gateway-dummy' ),
				),
				'default' => 'success',
				'desc_tip' => true,
			),
			'requireReceipt' => array(
			    'title'   => __( 'Comprobante de pago', 'pagos-moviles-peru' ),
				'type'    => 'checkbox',
				'label'   => __( 'Se requerirá subir comprobante', 'woocommerce-gateway-dummy' ),
				'default' => 'yes',
			),
			'bankAcct_alias' => array(
				'title'       => __( 'Alias', 'woocommerce-gateway-dummy' ),
				'type'        => 'text',
				'description' => __( 'Alias de la cuenta destino para transferencias', 'woocommerce-gateway-dummy' ),
				'default'     => __( 'YUYO.ALGA.BATATA', 'woocommerce-gateway-dummy' ),
				'desc_tip'    => true,
			),
			'bankAcct_cci' => array(
				'title'       => __( 'CCI/CBU', 'woocommerce-gateway-dummy' ),
				'type'        => 'text',
				'description' => __( 'CCI/CBU de la cuenta destino para transferencias', 'woocommerce-gateway-dummy' ),
				'default'     => __( '0140303703694952144913', 'woocommerce-gateway-dummy' ),
				'desc_tip'    => true,
			),
			'bankAcct_holder' => array(
				'title'       => __( 'Titular', 'woocommerce-gateway-dummy' ),
				'type'        => 'text',
				'description' => __( 'Titular de la cuenta destino para transferencias', 'woocommerce-gateway-dummy' ),
				'default'     => __( 'Silvano Emanuel Roqués', 'woocommerce-gateway-dummy' ),
				'desc_tip'    => true,
			),			
		);
	}
	/**
	 * Validate frontend fields.
	 *
	 * Validate payment fields on the frontend.
	 *
	 * @return bool
	 */
	/*
    public function validate_fields() {
		if( $this->requireReceipt == 'yes' && empty( $_POST['receipt_file'] ) && $_POST['payment_method'] == 'dummy' ) {
            wc_add_notice( 'Debe adjuntar el comprobante de pago', 'error' );
            return false;
        }
        return true;
	}
	*/

	/**
	 * Process the payment and return the result.
	 *
	 * @param  int  $order_id
	 * @return array
	 */
	public function process_payment( $order_id ) {

		$payment_result = $this->get_option( 'result' );
		$payment_requireReceipt = $this->get_option( 'requireReceipt' );
		
		//throw new Exception( json_encode($_POST) );
		if ( 'success' === $payment_result ) {
			$order = wc_get_order( $order_id );
			$order->payment_complete();
			
			$order->update_status( 'on-hold' );
            //$order_note = __( 'Pedido pagado vía YAPE/PLIN/Transferencia esperando validación', 'woocommerce-gateway-dummy' );
            //$order->add_order_note( $order_note, true );
			
			$order->add_meta_data('_receipt_file',esc_url( $_POST['gtwdata_receipturl'] ));
			$order->save();

			// Remove cart
			WC()->cart->empty_cart();

			// Return thankyou redirect
			return array(
				'result' 	=> 'success',
				'redirect'	=> $this->get_return_url( $order )
			);
		} else {
			$message = __( 'Order payment failed. To make a successful payment using Dummy Payments, please review the gateway settings.', 'woocommerce-gateway-dummy' );
			throw new Exception( $message );
		}
	}
}
