export function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  return new Response(params.id, {
    status: 200,
  })
}
