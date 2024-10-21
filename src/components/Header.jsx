import { useContext } from "react";
import LogoImg from "../assets/logo.jpg";
import Button from "./UI/Button";
import CartContext from "../store/CartContext";
import UserProgressContext from "../store/UserProgressContext";

export default function Header() {
  const cartContext = useContext(CartContext);
  const userProgressContext = useContext(UserProgressContext);

  function handleShowCart() {
    userProgressContext.showCart();
  }

  const totalCartItems = cartContext.items.reduce((totalNumber, item) => {
    return totalNumber + item.quantity;
  }, 0);
  return (
    <header id="main-header">
      <div id="title">
        <img src={LogoImg} alt="A restaurant" />
        <h1>Food Order App</h1>
      </div>
      <nav>
        <Button textOnly onClick={handleShowCart}>
          Cart ({totalCartItems})
        </Button>
      </nav>
    </header>
  );
}
