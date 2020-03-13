import React from 'react';
import Header from './header.jsx';
import ProductList from './product-list';
import ProductDetails from './product-details.jsx';
import CartSummary from './cart-summary.jsx';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      isLoading: true,
      view: { name: 'catalog', params: {} },
      cart: []
    };
    this.setView = this.setView.bind(this);
    this.getCartItems = this.getCartItems.bind(this);
    this.addToCart = this.addToCart.bind(this);
  }

  componentDidMount() {
    fetch('/api/health-check')
      .then(res => res.json())
      .then(data => this.setState({ message: data.message || data.error }))
      .catch(err => this.setState({ message: err.message }))
      .finally(() => this.setState({ isLoading: false }));

    this.getCartItems();
  }

  setView(name, params) {
    this.setState({
      view: { name, params }
    });
  }

  getCartItems() {
    fetch('/api/cart')
      .then(res => res.json())
      .then(data => this.setState({
        cart: data
      }))
      .catch(err => this.setState({ message: err.message }));
  }

  addToCart(product) {
    fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    })
      .then(response => response.json())
      .then(data => {
        const myCart = this.state.cart;
        this.setState({ cart: myCart.concat(data) });
      });
  }

  render() {
    const myState = this.state.view;
    let conditionalRender;
    if (myState.name === 'details') {
      conditionalRender = <ProductDetails newState={myState.params} onRender={this.setView} addToCart={this.addToCart}/>;
    } else if (myState.name === 'catalog') {
      conditionalRender = <ProductList onRender={this.setView} />;
    } else if (myState.name === 'cart') {
      conditionalRender = <CartSummary onRender={this.setView} newState={myState.params} cart={this.state.cart} />;
    }
    return (
      <div>
        <Header cartItemCount={this.state.cart.length} onRender={this.setView} />,
        {conditionalRender}
      </div>
    );
  }
}
