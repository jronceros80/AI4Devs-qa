import React from 'react';
import { Col, Card } from 'react-bootstrap';
import { Droppable, Draggable } from 'react-beautiful-dnd';

const StageColumn = ({ stage, index, onCardClick }) => {
    return (
        <Col md={3} data-testid="phase-column">
            <Card className="mb-3">
                <Card.Header className="bg-light">
                    <h5 className="mb-0">{stage.title}</h5>
                </Card.Header>
                <Card.Body>
                    <Droppable droppableId={index.toString()}>
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {stage.candidates.map((candidate, candidateIndex) => (
                                    <Draggable
                                        key={candidate.id}
                                        draggableId={candidate.id}
                                        index={candidateIndex}
                                    >
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                onClick={() => onCardClick(candidate)}
                                                data-testid="candidate-card"
                                            >
                                                <Card className="mb-2 shadow-sm">
                                                    <Card.Body>
                                                        <Card.Title className="h6">{candidate.name}</Card.Title>
                                                        {candidate.rating && (
                                                            <Card.Text className="text-muted">
                                                                Rating: {candidate.rating}
                                                            </Card.Text>
                                                        )}
                                                    </Card.Body>
                                                </Card>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default StageColumn;
