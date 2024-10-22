import { useContext } from "react";
import CartContext from "../store/CartContext";
import Modal from "./UI/Modal";
import UserProgressContext from "../store/UserProgressContext";

import { currencyFormatter } from "../util/formatting";
import Input from "./UI/Input";
import Button from "./UI/Button";
import useHttp from "../hooks/useHttp";

const requestBody = {
  method: "POST",
  headers: { "Content-Type": "application/json" },
};

export default function Checkout() {
  const cartContext = useContext(CartContext);
  const userProgressContext = useContext(UserProgressContext);

  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
    clearData,
  } = useHttp("http://localhost:3000/orders", requestBody);

  const cartTotal = cartContext.items.reduce((totalPrice, item) => {
    return totalPrice + item.price * item.quantity;
  }, 0);

  function handleClose() {
    userProgressContext.hideCheckout();
  }

  function handleFinish() {
    userProgressContext.hideCheckout();
    cartContext.clearCart();
    clearData();
  }

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const customerData = Object.fromEntries(formData.entries());

    sendRequest(
      JSON.stringify({
        order: { items: cartContext.items, customer: customerData },
      })
    );

    // fetch("http://localhost:3000/orders", {
    //   method: "post",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     order: { items: cartContext.items, customer: customerData },
    //   }),
    // });
  }

  let actions = (
    <>
      <Button type="button" textOnly onClick={handleClose}>
        Close
      </Button>
      <Button>Submit Order</Button>
    </>
  );

  if (isSending) {
    actions = <span>Sending Order Data...</span>;
  }

  if (data && !error) {
    return (
      <Modal
        open={userProgressContext.progress === "checkout"}
        onClose={handleFinish}
      >
        <h2>Success!</h2>
        <p>Your order was submitted Successfully!</p>
        <p className="modal-actions">
          <Button onClick={handleClose}>Ok</Button>
        </p>
      </Modal>
    );
  }

  return (
    <Modal
      open={userProgressContext.progress === "checkout"}
      onClose={handleClose}
    >
      <form onSubmit={handleSubmit}>
        <h2>Checkout</h2>
        <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>

        <Input label="Full Name" type="text" id="name" />
        <Input label="E-mail Address" type="email" id="email" />
        <Input label="Street Address" type="text" id="street" />
        <div className="control-row">
          <Input label="Postal Code" type="text" id="postal-code" />
          <Input label="City" type="text" id="city" />
        </div>

        {error && <Error title="Failed to place the order." message={error} />}

        <p className="modal-actions">{actions}</p>
      </form>
    </Modal>
  );
}
