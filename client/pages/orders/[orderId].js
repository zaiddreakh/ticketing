import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const OrderShow = (props) => {
  const [timeLeft, setTimeLeft] = useState(0);

  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: props.order.id,
    },
    onSuccess: (payment) => Router.push('/orders'),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(props.order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft(); // manual first call, because the interval will only start after one 1 second
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [props.order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div>
      time left to pay {timeLeft} seconds
      <StripeCheckout
        token={(token) => {
          console.log(token);
          doRequest({ token: token.id });
        }}
        stripeKey="pk_test_51I2NVEKrO8VLLdjMiHvbtZgDekHBIvVs43zAIY2F53NiDJ8QBCGNSv3ne7xqhboawtQipfSvWoU93LjdfcTdFHID001dhClDwc"
        amount={props.order.ticket.price * 100}
        email={props.currentUser.email}
      />
      {errors}
    </div>
  );
};

export default OrderShow;

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`api/orders/${orderId}`);

  return { order: data };
};
