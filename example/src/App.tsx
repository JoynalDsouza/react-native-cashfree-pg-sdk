// @ts-nocheck

import * as React from 'react';
import { Component } from 'react';

import { Button, Platform, StyleSheet, Text, View } from 'react-native';
import {
  CFPaymentGatewayService,
  CFErrorResponse,
} from 'react-native-cashfree-pg-sdk';
import {
  CFDropCheckoutPayment,
  CFEnvironment,
  CFPaymentComponentBuilder,
  CFPaymentModes,
  CFSession,
  CFThemeBuilder,
} from 'cashfree-pg-api-contract';

const BASE_RESPONSE_TEXT = 'Response or error will show here.';

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      responseText: BASE_RESPONSE_TEXT,
    };
  }

  componentWillUnmount() {
    console.log('UNMOUNTED');
    CFPaymentGatewayService.removeCallback();
    CFPaymentGatewayService.removeEventSubscriber();
  }

  changeResponseText = (message: string) => {
    this.setState({
      responseText: message,
    });
  };

  componentDidMount() {
    console.log('MOUNTED');
    CFPaymentGatewayService.setEventSubscriber({
      onReceivedEvent(eventName: string, map: Map<string, string>): void {
        console.log(
          'Event recieved on screen: ' +
            eventName +
            ' map: ' +
            JSON.stringify(map)
        );
      },
    });
    CFPaymentGatewayService.setCallback({
      onVerify(orderID: string): void {
        console.log('orderId is :' + orderID);
      },
      onError(error: CFErrorResponse, orderID: string): void {
        console.log(
          'exception is : ' + JSON.stringify(error) + '\norderId is :' + orderID
        );
      },
    });
  }

  async _startCheckout() {
    try {
      const session = new CFSession(
        'session_IoErBDpoq1nreFnrYWltLCy-o9HD3RdV8N7iinJcAbZbYRN6K946_KdYXoeVQRDuOhyKDm6JBxlmKLcZIvSa_sBMRi5_8nzoGL7taayp365A',
        'order_880242IfUmh0KTA3O9MMzGvmKg83ufbL',
        CFEnvironment.SANDBOX
      );
      const paymentModes = new CFPaymentComponentBuilder()
        .add(CFPaymentModes.CARD)
        .add(CFPaymentModes.UPI)
        .add(CFPaymentModes.NB)
        .add(CFPaymentModes.WALLET)
        .add(CFPaymentModes.PAY_LATER)
        .build();
      const theme = new CFThemeBuilder()
        .setNavigationBarBackgroundColor('#E64A19')
        .setNavigationBarTextColor('#FFFFFF')
        .setButtonBackgroundColor('#FFC107')
        .setButtonTextColor('#FFFFFF')
        .setPrimaryTextColor('#212121')
        .setSecondaryTextColor('#757575')
        .build();
      const dropPayment = new CFDropCheckoutPayment(
        session,
        paymentModes,
        theme
      );
      console.log(JSON.stringify(dropPayment));
      CFPaymentGatewayService.doPayment(dropPayment);
    } catch (e: any) {
      console.log(e.message);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.button}>
          <Button onPress={() => this._startCheckout()} title="Start Payment" />
        </View>
        <Text style={styles.response_text}> {this.state.responseText} </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: Platform.OS === 'ios' ? 56 : 24,
    backgroundColor: '#eaeaea',
    alignItems: 'center',
    flexDirection: 'column',
    flex: 1,
  },
  button: {
    color: '#61aafb',
    margin: 8,
    width: 200,
  },
  response_text: {
    margin: 16,
    fontSize: 14,
  },
});
