const rabbitMQService = require('../services/rabbitmq');

class TrackController {

  /**
   * Handles the tracking of an event by sending it to a message queue.
   * 
   * @param {Object} ctx - The Koa context object containing the request and response.
   * @param {Object} ctx.request.body - The request body containing event details.
   * @param {string} ctx.request.body.autoId - The ID of the automobile.
   * @param {string} ctx.request.body.eventType - The type of the event, either 'ad_view' or 'phone_view'.
   * 
   * @throws {Error} - Throws an error if the event cannot be sent to the queue.
   * 
   * Sets the response status and body based on the success or failure of event processing:
   * - 400 if the autoId or eventType are missing or invalid.
   * - 202 if the event is successfully queued.
   * - 500 if there is an internal server error while processing the event.
   */
  async trackEvent(ctx) {
    const { autoId, eventType } = ctx.request.body;
    
    if (!autoId || !eventType) {
      ctx.status = 400;
      ctx.body = { error: 'Missing autoId or eventType' };
      return;
    }

    if (!['ad_view', 'phone_view'].includes(eventType)) {
      ctx.status = 400;
      ctx.body = { error: 'Invalid event type' };
      return;
    }

    try {
      await rabbitMQService.sendToQueue('tracking_events', { autoId, eventType });
      ctx.status = 202;
      ctx.body = { status: 'queued' };
    } catch (err) {
      console.error('Error sending event to queue:', err);
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
    }
  }
}

module.exports = new TrackController();