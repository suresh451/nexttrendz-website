// Write your code here
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import SimilarProductItem from '../SimilarProductItem'

import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productData: {},
    similarProductData: [],
    apiStatus: apiStatusConstants.initial,
    quantity: 1,
  }

  componentDidMount() {
    this.getProductData()
  }

  getFormattedData = data => ({
    availability: data.availability,
    description: data.description,
    imageUrl: data.image_url,
    brand: data.brand,
    price: data.price,
    rating: data.rating,
    totalReviews: data.total_reviews,
    title: data.title,
    id: data.id,
    total_reviews: data.total_reviews,
  })

  getProductData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({apiStatus: apiStatusConstants.initial})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = this.getFormattedData(fetchedData)
      const updatedSimilarProductData = fetchedData.similar_products.map(
        eachSimilarData => this.getFormattedData(eachSimilarData),
      )

      this.setState({
        productData: updatedData,
        similarProductData: updatedSimilarProductData,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 404) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">Product Not Found</h1>
      <Link to="/products">
        <button type="button">Continue Shopping</button>
      </Link>
    </div>
  )

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onDecrementQuantity = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({
        quantity: prevState.quantity - 1,
      }))
    }
  }

  onIncrementQuantity = () => {
    this.setState(prevState => ({
      quantity: prevState.quantity + 1,
    }))
  }

  renderProductDetailsView = () => {
    const {productData, quantity, similarProductData} = this.state
    const {
      title,
      availability,
      brand,
      price,
      rating,
      totalReviews,
      imageUrl,
      description,
    } = productData

    return (
      <div>
        <div className="main-div1">
          <img src={imageUrl} className="detailed-img" alt="product" />
          <div>
            <h1>{title}</h1>
            <p>Rs.{price}</p>
            <div>
              <button type="button">
                <p>{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  className=""
                  alt="start"
                />
              </button>
              <p>{totalReviews}</p>
            </div>
            <p>{description}</p>
            <p>Avaialable: {availability}</p>
            <p>Brand: {brand}</p>
            <hr />
            <div className="count-div">
              <button
                type="button"
                data-testid="minus"
                onClick={this.onDecrementQuantity}
              >
                <BsDashSquare />
              </button>
              <p>{quantity}</p>
              <button
                type="button"
                data-testid="plus"
                onClick={this.onIncrementQuantity}
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button">Add To Cart</button>
          </div>
        </div>
        <h1>Similar Products</h1>
        <ul className="ul-list">
          {similarProductData.map(eachProduct => (
            <SimilarProductItem
              similarCardDetails={eachProduct}
              key={eachProduct.id}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderProductDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetailsView()

      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()

      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        <div>{this.renderProductDetails()}</div>
      </div>
    )
  }
}

export default ProductItemDetails
