import { Link } from "react-router-dom";
import EventCard from "../../components/EventCard";
import { events } from "../home/eventsjson";

const AllEvents = () => {
    return (
        <div>
            {events.map((event, index) => {
                return <div key={index}>
                    <Link to='/'>
                        <EventCard event={event} />
                    </Link>
                </div>
            })}

        </div>
    );
}

export default AllEvents;