import { useState, useCallback, useEffect } from 'react';
import { Affect } from './affect';
import update from 'immutability-helper';
export const Affects = ({cards, setCards}) => {
    {
        // const [cards, setCards] = useState(affect || []);
        // useEffect(()=>{
        //     console.log("CARDS ", cards);
        // }, [cards]);
        const moveCard = useCallback((dragIndex, hoverIndex) => {
            console.log("CARDS ", cards)
            const dragCard = cards[dragIndex];
            setCards(update(cards, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, dragCard],
                ],
            }));
        }, [cards]);
        // const renderCard = (card, index) => {
        //     return (<Affect key={card._id || 'ci'+index} index={index} id={card._id || 'ci'+index} text={card.parameter.name} moveCard={moveCard}/>);
        // };
        return (<>
				    {cards.map((card, i) => <Affect key={card._id} index={i} id={card._id} text={card.parameter.name} moveCard={moveCard}/>)}
			    </>
            );
    }
};
