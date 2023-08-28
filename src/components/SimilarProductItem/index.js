// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {similarCardDetails} = props
  const {imageUrl, title, brand, price, rating} = similarCardDetails

  return (
    <li>
      <img
        src={imageUrl}
        className="list-item-img"
        alt={`similar product ${title}`}
      />
      <h1 className="head">{title}</h1>
      <p>{brand}</p>
      <div className="rating-div">
        <p>Rs.{price}</p>
        <button type="button">
          {rating}
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            className="star"
            alt="star"
          />
        </button>
      </div>
    </li>
  )
}

export default SimilarProductItem
