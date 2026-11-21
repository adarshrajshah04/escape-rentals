from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.model.booking import BookingTable
from app.model.user import UserTable
from app.model.properties import PropertyTable

from app.schemas.booking import BookingCreate, BookingResponse

from app.utils.auth import get_current_user, get_admin_user
from sqlalchemy.orm import joinedload



router = APIRouter(
    prefix="/booking",
    tags=["Booking"]
)


# READ: Logged-in user ki apni bookings


@router.get("/")
def get_my_bookings(
    db: Session = Depends(get_db),
    current_user: UserTable = Depends(get_current_user)
):
    bookings = db.query(BookingTable).options(
        joinedload(BookingTable.property)
    ).filter(
        BookingTable.user_id == current_user.id
    ).all()

    return bookings


# All booking for only admin
@router.get("/all")
def get_all_bookings(
    db: Session = Depends(get_db),
    current_admin: UserTable = Depends(get_admin_user)
):
    bookings = db.query(BookingTable).all()

    result = []

    for booking in bookings:
        user = db.query(UserTable).filter(
            UserTable.id == booking.user_id
        ).first()

        property = db.query(PropertyTable).filter(
            PropertyTable.id == booking.property_id
        ).first()

        result.append({
            "id": booking.id,
            "user_id": user.id if user else None,
            "user_name": user.first_name if user else None,
            "email": user.email if user else None,
            "property_name": property.name if property else None,
            "property_id": property.id if property else None,
            "check_in": booking.check_in,
            "check_out": booking.check_out,
            "total_amount": booking.total_price,
            "status": booking.status
        })

    return result

# READ: Specific booking
@router.get("/{booking_id}", response_model=BookingResponse)
def get_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: UserTable = Depends(get_current_user)
):
    booking = db.query(BookingTable).filter(
        BookingTable.id == booking_id
    ).first()

    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )

    if not current_user.is_admin and booking.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You are not allowed to access this booking"
        )

    return booking


# UPDATE: User apni booking update kar sakta hai
@router.put("/{booking_id}", response_model=BookingResponse)
def update_booking(
    booking_id: int,
    booking_data: BookingCreate,
    db: Session = Depends(get_db),
    current_user: UserTable = Depends(get_current_user)
):
    booking = db.query(BookingTable).filter(
        BookingTable.id == booking_id
    ).first()

    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )

    if not current_user.is_admin and booking.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You cannot update this booking"
        )
    booking.check_in=booking_data.check_in
    booking.check_out=booking_data.check_out
    booking.guests=booking_data.guests
    
    db.commit()
    db.refresh(booking)
    
    return booking
   


# DELETE: User apni booking delete kar sakta hai
@router.put("/{booking_id}/cancel")
def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: UserTable = Depends(get_current_user)
):
    booking = db.query(BookingTable).filter(
        BookingTable.id == booking_id
    ).first()

    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )

    if not current_user.is_admin and booking.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You cannot cancel this booking"
        )

    if booking.status == "cancelled":
        raise HTTPException(
            status_code=400,
            detail="Booking is already cancelled"
        )

    if booking.status == "completed":
        raise HTTPException(
            status_code=400,
            detail="Completed booking cannot be cancelled"
        )

    booking.status = "cancelled"

    db.commit()
    db.refresh(booking)

    return {
        "msg": "Booking cancelled successfully",
        "booking_id": booking.id,
        "status": booking.status
    }