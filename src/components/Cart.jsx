import { useContext } from "react";
import CartContext from "../store/CartContext";
import Modal from "./UI/Modal";
import { currencyFormatter } from "../util/formatting";
import Button from "./UI/Button";
import UserProgressContext from "../store/UserProgressContext";
import CartItem from "./CartItem";

export default function Cart() {
  const cartContext = useContext(CartContext);
  const userProgressContext = useContext(UserProgressContext);

  const cartTotal = cartContext.items.reduce((totalPrice, item) => {
    return totalPrice + item.price * item.quantity;
  }, 0);

  function handleCloseCart() {
    userProgressContext.hideCart();
  }

  function handleGoToCheckout() {
    userProgressContext.showCheckout();
  }

  return (
    <Modal
      className="cart"
      open={userProgressContext.progress === "cart"}
      onClose={userProgressContext.progress === "cart" ? handleCloseCart : null}
    >
      <h2>Your Cart</h2>
      <ul>
        {cartContext.items.map((item) => (
          <CartItem
            key={item.id}
            {...item}
            onDecrease={() => cartContext.removeItem(item.id)}
            onIncrease={() => cartContext.addItem(item)}
          />
        ))}
      </ul>
      <p className="cart-price">{currencyFormatter.format(cartTotal)}</p>
      <p className="modal-actions">
        <Button textOnly onClick={handleCloseCart}>
          Close
        </Button>
        {cartContext.items.length > 0 && (
          <Button onClick={handleGoToCheckout}>Go To Checkout</Button>
        )}
      </p>
    </Modal>
  );
}
