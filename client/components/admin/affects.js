import { useState, useCallback, useEffect } from 'react';
import { Affect } from './affect';
import update from 'immutability-helper';
const style = {
    width: 400,
};
export const Affects = ({affect}) => {
    {
        const [cards, setCards] = useState(affect || []);
        // useEffect(()=>{
        //     console.log("CARDS ", cards);
        // }, [cards]);
        const moveCard = useCallback((dragIndex, hoverIndex) => {
            const dragCard = cards[dragIndex];
            setCards(update(cards, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, dragCard],
                ],
            }));
        }, [cards]);
        const renderCard = (card, index) => {
            return (<Affect key={card._id} index={index} id={card._id} text={card.parameter.name} moveCard={moveCard}/>);
        };
        return (<>
				<div style={style}>{cards.map((card, i) => renderCard(card, i))}</div>
			</>);
    }
};
