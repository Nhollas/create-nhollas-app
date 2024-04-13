export function DELETE(
  request: Request,
  { params }: { params: { exampleId: string } },
) {
  return new Response(params.exampleId, {
    status: 200,
  })
}
