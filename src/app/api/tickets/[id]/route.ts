import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params Promise before accessing its properties
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    // Remove "COMP-" prefix if present
    const ticketId = id.startsWith('COMP-') ? id.substring(5) : id;
    
    // Check if the ID is valid
    if (!ticketId || isNaN(Number(ticketId))) {
      return NextResponse.json(
        { error: 'Invalid ticket ID' },
        { status: 400 }
      );
    }
    
    
    const ticket = {
      ticket_id: parseInt(ticketId),
      user_id: Math.floor(10000 + Math.random() * 90000),
      subject: 'Road Pothole Issue',
      description: 'Large pothole on main street causing traffic and vehicle damage',
      category_id: 1,
      category: 'Infrastructure', 
      location: 'Main Street, Downtown',
      photo_url: '/sample-image.jpg',
      status: ['Pending', 'Assigned', 'In Progress', 'Resolved', 'Rejected'][Math.floor(Math.random() * 5)],
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    return NextResponse.json(ticket);
    
  } catch (error) {
    console.error('Ticket retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve ticket information' },
      { status: 500 }
    );
  }
} 