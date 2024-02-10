"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const react_1 = require("react");
const spots_1 = require("../../store/spots");
require("./HomePage.css");
const HomePage = () => {
    const dispatch = (0, react_redux_1.useDispatch)();
    // Use RootState as the type for useSelector
    const spotsObj = (0, react_redux_1.useSelector)((state) => state.spots.allSpots);
    // Define spots array as Spot[]
    const spots = Object.values(spotsObj);
    (0, react_1.useEffect)(() => {
        dispatch((0, spots_1.getAllSpots)());
        document.title = 'Home';
    }, [dispatch]);
    return id = 'main-container' >
        { spots, : .map((spot) => className = 'spot-container', key = { spot, : .id } >
                to, {} `/spots/${spot.id}`) };
    style = {};
    {
        textDecoration: 'none';
    }
};
 >
    className;
'spot-image-container';
src = { spot, : .previewImage };
alt = 'prevImage' /  >
    className;
'top-line' >
    id;
'left-side' > { spot, : .city }, { spot, : .state } < /div>
    < div;
id = 'right-side' >
    className;
'star-emoticon' >
    className;
"fa-solid fa-star fa-sm" > /i>;
{
    spot.avgRating;
}
/div>
    < /div>
    < /div>
    < div;
className = 'price' > $;
{
    spot.price.toFixed(2);
}
night < /div>
    < /NavLink>
    < /div>;
/div>
    < /section>;
;
;
exports.default = HomePage;
